export function assertAdmin(req: Request) {
  // Super simple: require a header. Upgrade to real auth later.
  const flag = req.headers.get('x-local-admin');
  if (flag !== '1') {
    const err = new Error('Unauthorized');
    (err as any).status = 401;
    throw err;
  }
}
