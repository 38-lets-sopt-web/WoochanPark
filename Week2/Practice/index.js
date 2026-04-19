document.querySelector("button").addEventListener("click", () => {
    const input = document.getElementById("input");
    const ul = document.getElementById("ul");
    const li = document.createElement("li");
    li.textContent = input.value;
    ul.appendChild(li);

    if (localStorage.getItem("todo") === null) {
        localStorage.setItem("todo", JSON.stringify([]));
    }
    let todo = JSON.parse(localStorage.getItem("todo"));
    todo.push(input.value);
    localStorage.setItem("todo", JSON.stringify(todo));
    input.value = "";
});

const ul = document.getElementById("ul");
const todo = JSON.parse(localStorage.getItem("todo"));
if (todo) {
    todo.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        ul.appendChild(li);
    });
}