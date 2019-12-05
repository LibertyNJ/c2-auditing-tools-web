'use-strict';

export function reduceClassNames(...classNames) {
  return classNames.length > 1 ? classNames.join(' ') : classNames.toString();
}
