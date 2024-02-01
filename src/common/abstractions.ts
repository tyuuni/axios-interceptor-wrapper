
export interface UnaryOperator<OperandType, ReturnType> {
    (operand: OperandType): ReturnType;
}

/**
 * semantic alias
 * @alias module:unary.UnaryOperator
 */
export type Transformer<SourceType, TargetType> = UnaryOperator<SourceType, TargetType>;

export type AsyncTransformer<SourceType, TargetType> = Transformer<SourceType, Promise<TargetType>>;

export type Predicate<T> = UnaryOperator<T, boolean>;

export type AsyncPredicate<T> = UnaryOperator<T, Promise<boolean>>;

/**
 * A boolean indicates whether the message has been consumed successfully.
 */
export type Consumer<T> = UnaryOperator<T, Promise<boolean>>;

export interface BinaryOperator<LeftOperandType, RightOperandType, ReturnType> {
    (left: LeftOperandType, right: RightOperandType): ReturnType;
}

export type BiConsumer<SourceType1, SourceType2> = BinaryOperator<SourceType1, SourceType2, Promise<void>>;


export interface Generator<T> {
    (): Promise<T>;
}