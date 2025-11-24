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
