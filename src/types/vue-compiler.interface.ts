// Converted from vue flow type definitions.
export type Maybe<T> = T | null | undefined;

export interface IASTModifiers { [key: string]: boolean; }
export interface IASTIfCondition { exp: Maybe<string>; block: IASTElement; }
type ASTIfConditions = IASTIfCondition[];

export interface IASTElementHandler {
    value: string;
    params?: any[];
    modifiers: Maybe<IASTModifiers>;
}

export interface IASTElementHandlers {
    [key: string]: IASTElementHandler | IASTElementHandler[];
}

export interface IASTDirective {
    name: string;
    rawName: string;
    value: string;
    arg: Maybe<string>;
    modifiers: Maybe<IASTModifiers>;
}

type ASTNode = IASTElement | IASTText | IASTExpression;

export interface IASTElement {
    type: 1;
    tag: string;
    attrsList: Array<{ name: string; value: any }>;
    attrsMap: { [key: string]: any };
    parent: IASTElement | void;
    children: ASTNode[];

    processed?: true;

    static?: boolean;
    staticRoot?: boolean;
    staticInFor?: boolean;
    staticProcessed?: boolean;
    hasBindings?: boolean;

    text?: string;
    attrs?: Array<{ name: string; value: any }>;
    props?: Array<{ name: string; value: string }>;
    plain?: boolean;
    pre?: true;
    ns?: string;

    component?: string;
    inlineTemplate?: true;
    transitionMode?: string | null;
    slotName?: Maybe<string>;
    slotTarget?: Maybe<string>;
    slotScope?: Maybe<string>;
    scopedSlots?: { [name: string]: IASTElement };

    ref?: string;
    refInFor?: boolean;

    if?: string;
    ifProcessed?: boolean;
    elseif?: string;
    else?: true;
    ifConditions?: ASTIfConditions;

    for?: string;
    forProcessed?: boolean;
    key?: string;
    alias?: string;
    iterator1?: string;
    iterator2?: string;

    staticClass?: string;
    classBinding?: string;
    staticStyle?: string;
    styleBinding?: string;
    events?: IASTElementHandlers;
    nativeEvents?: IASTElementHandlers;

    transition?: string | true;
    transitionOnAppear?: boolean;

    model?: {
      value: string;
      callback: string;
      expression: string;
    };

    directives?: IASTDirective[];

    forbidden?: true;
    once?: true;
    onceProcessed?: boolean;
    wrapData?: (code: string) => string;
    wrapListeners?: (code: string) => string;

    // 2.4 ssr optimization
    ssrOptimizability?: number;

    // weex specific
    appendAsTree?: boolean;
}

export interface IASTExpression {
    type: 2;
    expression: string;
    text: string;
    tokens: Array<string | Record<string, any>>;
    static?: boolean;
    // 2.4 ssr optimization
    ssrOptimizability?: number;
}

export interface IASTText {
    type: 3;
    text: string;
    static?: boolean;
    isComment?: boolean;
    // 2.4 ssr optimization
    ssrOptimizability?: number;
}

export interface IModelParseResult {
    exp: string;
    key: string | null;
}
