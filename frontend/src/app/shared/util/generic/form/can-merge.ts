/**
 * Essa interface permite que uma Model X faça um "merge" dos seus dados
 * com uma outra model.
 *
 * Ao final da execução do método "merge", a model do tipo T deve ter os dados da classe
 * que implementa CanMerge.
 */
export interface CanMerge<T> {

    initializeWithModel(model: T);

    merge(model: T);
}
