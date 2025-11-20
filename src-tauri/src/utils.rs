pub fn combine<T, U, V, F>(first: Vec<T>, second: Vec<U>, f: F) -> Vec<V>
where
    F: Fn(T, U) -> V,
{
    first
        .into_iter()
        .zip(second.into_iter())
        .map(|(a, b)| f(a, b))
        .collect()
}
