import _ from 'lodash';

export function convertToSnakeCase(camelObj) {
  return _.mapKeys(camelObj, _.rearg(_.snakeCase, 1));
}
export function convertToCamelCase(snakeObj) {
  return _.mapKeys(snakeObj, _.rearg(_.camelCase, 1));
}
