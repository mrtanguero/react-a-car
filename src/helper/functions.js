export const currentTotalLength = (arr) => {
  return arr.reduce((sum, cur) => sum + cur.data.data.length, 0);
};

export const renderEquipmentTreeOptions = (data) => {
  return data.map((option) => {
    const treeOptions = {};
    treeOptions.title = option.name;
    treeOptions.value = option.id;
    treeOptions.selectable = false;
    if (option.max_quantity > 1) {
      const children = [];
      for (let i = 0; i < option.max_quantity; i++) {
        children.push({
          title: `${option.name}${i + 1 > 1 ? 's' : ''}: ${i + 1}`,
          value: `${option.id}-${i + 1}`,
        });
      }
      treeOptions.children = children;
    } else {
      treeOptions.value = `${option.id}-1`;
      treeOptions.selectable = true;
    }
    return treeOptions;
  });
};
