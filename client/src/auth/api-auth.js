const signin = async (user) => {
  try {
    let response = await fetch("https://jsonplaceholder.typicode.com/todos/1", {
      method: "GET",
      // headers: {
      //   Accept: "application/json",
      //   "Content-Type": "application/json",
      // },
      // credentials: "include",
      // body: JSON.stringify(user),
    });

    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const signout = async () => {
  try {
    let response = await fetch("/auth/signout/", { method: "GET" });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export { signin, signout };
