const users = [];

function addUser(id, zealId, room) {
  const user = { id, zealId, room };
  users.push(user);
  return user;
}
