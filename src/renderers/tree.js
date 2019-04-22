import _ from 'lodash';

const tab = 2;
const currentTab = depth => ' '.repeat(tab * depth);

const stringify = (value, depth) => {
  if (!_.isObject(value)) {
    return value;
  }
  const line = Object.keys(value)
    .reduce((acc, key) => `${acc}${currentTab(depth)}${key}: ${value[key]}`, '');
  return `{\n${line}\n${currentTab(depth - tab)}}`;
};

const render = (ast, depth = 1) => ast.reduce((acc, item) => {
  const {
    key, value, type, children, oldValue, newValue,
  } = item;
  switch (type) {
    case 'added':
      return `${acc}${currentTab(depth)}+ ${key}: ${stringify(value, depth + tab + 1)}\n`;
    case 'unchangedButHasChildren':
      return `${acc}${currentTab(depth)}  ${key}: {\n${render(children, depth + tab)}${currentTab(depth)}  }\n`;
    case 'unchanged':
      return `${acc}${currentTab(depth)}  ${key}: ${stringify(value, depth + tab + 1)}\n`;
    case 'deleted':
      return `${acc}${currentTab(depth)}- ${key}: ${stringify(value, depth + tab + 1)}\n`;
    case 'changed':
      return `${acc}${currentTab(depth)}- ${key}: ${stringify(oldValue, depth + tab + 1)}\n${currentTab(depth)}+ ${key}: ${stringify(newValue, depth + tab + 1)}\n`;
    default:
      throw new Error('Unknown type node');
  }
}, '');
export default ast => `{\n${render(ast)}}`;
