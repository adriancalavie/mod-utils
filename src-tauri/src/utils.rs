/// Combines two vectors element-wise using a provided function.
///
/// # Parameters
/// - `first`: The first vector.
/// - `second`: The second vector.
/// - `f`: A function that takes one element from each vector and returns a new value.
///
/// # Returns
/// A vector containing the results of applying `f` to each pair of elements from `first` and `second`.
///
/// The length of the resulting vector is equal to the shorter of the two input vectors.
///
/// # Examples
/// ```
/// let v1 = vec![1, 2, 3];
/// let v2 = vec![4, 5, 6];
/// let result = combine(v1, v2, |a, b| a + b);
/// assert_eq!(result, vec![5, 7, 9]);
///
/// let v1 = vec![1, 2];
/// let v2 = vec![10, 20, 30];
/// let result = combine(v1, v2, |a, b| a * b);
/// assert_eq!(result, vec![10, 40]); // stops at the shorter vector
/// ```
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

/// Clamps a `value` to the `original_min..=original_max` range and maps it proportionally
/// to a new range `new_min..=new_max`.
///
/// # Parameters
/// - `value`: The input value to clamp and map.
/// - `original_min`: The minimum of the original range.
/// - `original_max`: The maximum of the original range.
/// - `new_min`: The minimum of the target range.
/// - `new_max`: The maximum of the target range.
///
/// # Returns
/// A `f32` representing the value clamped to the original range and scaled proportionally
/// into the new range.
///
/// If `original_min == original_max`, the function returns the midpoint of the new range
/// to avoid division by zero.
///
/// # Examples
/// ```
/// let result = proportional_clamp_f32(5.0, 0.0, 10.0, 0.0, 100.0);
/// assert_eq!(result, 50.0);
///
/// let result = proportional_clamp_f32(-5.0, 0.0, 10.0, 0.0, 100.0);
/// assert_eq!(result, 0.0); // clamped to original_min
///
/// let result = proportional_clamp_f32(15.0, 0.0, 10.0, 0.0, 100.0);
/// assert_eq!(result, 100.0); // clamped to original_max
/// ```
pub fn proportional_clamp_f32(
    value: f32,
    original_min: f32,
    original_max: f32,
    new_min: f32,
    new_max: f32,
) -> f32 {
    let clamped_value = value.clamp(original_min, original_max);

    let original_range = original_max - original_min;
    if original_range == 0.0 {
        // Avoid division by zero, return the middle of the new range
        return (new_min + new_max) / 2.0;
    }

    let proportion = (clamped_value - original_min) / original_range;
    new_min + proportion * (new_max - new_min)
}
