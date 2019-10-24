export function createRequest(method, resource, body = null) {
  return {
    body,
    head: {
      method,
      resource,
    },
  };
}
