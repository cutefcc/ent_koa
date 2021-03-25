export const formatOptions = (items = []) => {
  return items.map((v) => ({
    value: v.name,
    key: v.name,
    label: v.name,
    children: v.sub ? formatOptions(v.sub) : null,
  }))
}

export const formatCityOptions = (items = []) => {
  return items.map((v) => {
    let newItem = {}
    if (typeof v === 'string') {
      newItem = {
        value: v,
        key: v,
        label: v,
      }
    } else {
      newItem = {
        value: v.name,
        key: v.name,
        label: v.name,
        children: v.sub ? formatCityOptions(v.sub) : null,
      }
    }
    return newItem
  })
}
