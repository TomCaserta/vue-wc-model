import { IASTElement, IASTDirective } from './types/vue-compiler.interface';
import { genAssignmentCode } from './internals/model';

export type ConfigFunction = (el: IASTElement, dir: IASTDirective) => string;

export interface IOptions {
    eventNames?: {
        change: string|ConfigFunction;
        input: string|ConfigFunction;
    };
    valueExpression?: string|ConfigFunction;
}

const defaultOptions = {
    eventNames: {
        change: 'change',
        input: 'input',
    },
    valueExpression: '$event.target.value',
};

function resolveOption(
    el: IASTElement,
    dir: IASTDirective,
    item: string|ConfigFunction,
): string {
    if (typeof item === 'string') {
        return item;
    }

    return item(el, dir);
}

function addProp(el: IASTElement, name: string, value: string) {
    if (!el.attrs) {
        el.attrs = [];
    }

    el.attrs.push({ name, value });
    el.plain = false;
}

function addHandler(
    el: IASTElement,
    name: string,
    value: string,
) {
    const events = el.events || (el.events = {});
    const handlers = events[name];
    const newHandler: any = {
        value: value.trim(),
    };

    if (Array.isArray(handlers)) {
        handlers.unshift(newHandler);
    } else if (handlers) {
        events[name] = [newHandler, handlers];
    } else {
        events[name] = newHandler;
    }
}

export const createModelDirective = (
    options: IOptions = {},
) => {
    options = { ...defaultOptions, ...options };

    return (
        el: IASTElement,
        dir: IASTDirective,
    ) => {
        const opt = resolveOption.bind(null, el, dir);
        let valueExpression = opt(options.valueExpression);
        const { change, input } = options.eventNames!;

        const { value, modifiers } = dir;

        const { lazy, number: num, trim } = modifiers || { lazy: null, number: null, trim: null };

        const event = lazy ? opt(change) : opt(input);

        if (trim) {
            valueExpression = `(${valueExpression} || '').trim()`;
        }

        if (num) {
            valueExpression = `_n(${valueExpression})`;
        }

        const code = genAssignmentCode(value, valueExpression);

        addProp(el, 'value', `(${value})`);
        addHandler(el, event, code);

        if (trim || num) {
            addHandler(el, 'blur', '$forceUpdate()');
        }
    };
};
