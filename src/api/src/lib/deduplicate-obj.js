/**
 * deduplicate([...objs], (obj1, obj2) => obj1.item === obj2.item)
 */
export default function (originalArr, equalityCheckFn) {
  const newArray = []

  for (const obj of originalArr) {
    if (!newArray.some(_obj => equalityCheckFn(_obj, obj))) {
      newArray.push(obj)
    }
  }

  return newArray
}
