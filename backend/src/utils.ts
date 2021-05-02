export const isSubClass = (child: string, parent: string) => {
  return `is_subclass(${child}, ${parent}).\n`;
};

export const isA = (child: string, parent: string) => {
  return `is_a(${child}, ${parent}).\n`;
};

export const property = (child: string, parent: string) => {
  return `property(${child}, ${parent}).\n`;
};
