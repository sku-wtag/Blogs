import {
    showButton,
    showTodoInfo,
    addButton,
    formContainer,
    editForm,
    baseURL,
    searchBox,
    form
} from "./element.js";

let IsFormOpen = false

let postData = []


const renderPosts = (posts) => {
    const table = document.createElement("table");
    const headerRow = document.createElement("tr");

    const headers = ["Serial", "Title", "Description", "Action"];
    headers.forEach(headerText => {
        const th = document.createElement("th");
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    table.appendChild(headerRow);

    posts.forEach(item => {
        const row = document.createElement("tr");
        const serial = document.createElement("td")
        const title = document.createElement("td");
        const actions = document.createElement("td");
        const description = document.createElement("td");
        const editButton = document.createElement('button')
        const deleteButton = document.createElement('button')

        editButton.innerText = "Edit"
        deleteButton.innerText = "Delete"

        deleteButton.setAttribute("id", `delete-(${item.id})`)
        editButton.setAttribute("id", `edit-(${item.id})`)

        deleteButton.addEventListener("click", () => {
            deletePosts(item.id)
        })
        editButton.addEventListener("click", () => {
            editPosts({
                id: item.id,
                title: item.title,
                body: item.body,
                userId: item.userId
            })
        })
        serial.textContent = item.id
        title.textContent = item.title;
        description.textContent = item.body;

        actions.appendChild(editButton)
        actions.appendChild(deleteButton)
        row.appendChild(serial);
        row.appendChild(title);
        row.appendChild(description);
        row.appendChild(actions);
        table.appendChild(row);
    });
    showTodoInfo.innerHTML = ""
    showTodoInfo.appendChild(table);
}

const fetchData = async () => {

    try {
        const respose = await fetch(baseURL + "/posts")
        postData = await respose.json()
        renderPosts(postData)
    }
    catch (ex) {
        alert(ex.message)
    }
}

const addPost = async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const newData = {
        title: formData.get('title'),
        body: formData.get('body'),
        userId: 4
    };

    try {
        await fetch(baseURL + "/posts",
            {
                method: "POST",
                body: JSON.stringify(newData),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            }
        );
        alert("A new record has been added")
    }
    catch (ex) {
        alert(ex.message)
    }
}

function makeForm(postInfo = {}, form) {
    formContainer.innerHTML = ""
    form.innerHTML = ""

    const titleLabel = document.createElement('label');
    const titleInput = document.createElement('input');
    const userId = document.createElement('input');
    const id = document.createElement('input');
    const bodyLabel = document.createElement('label');
    const bodyInput = document.createElement('input');
    const submitButton = document.createElement('button');

    form.setAttribute("id", "submit_form")
    titleLabel.textContent = 'Title: ';
    titleInput.setAttribute('type', 'text');
    titleInput.setAttribute('name', 'title');
    bodyLabel.textContent = 'Body: ';
    bodyInput.setAttribute('type', 'text');
    bodyInput.setAttribute('name', 'body');
    submitButton.textContent = 'Update';
    userId.setAttribute('name', 'userId');
    id.setAttribute('name', 'id');
    userId.setAttribute('hidden', 'true');
    id.setAttribute('hidden', 'true');

    if (postInfo?.userId) {
        userId.value = postInfo.userId
    }
    if (postInfo?.id) {
        id.value = postInfo.id
    }

    if (postInfo?.title) {
        titleInput.value = postInfo.title
    }
    if (postInfo?.body) {
        bodyInput.value = postInfo.body
    }

    form.appendChild(titleLabel);
    form.appendChild(titleInput);
    form.appendChild(userId)
    form.appendChild(id)
    form.appendChild(bodyLabel);
    form.appendChild(bodyInput);
    form.appendChild(submitButton);
    formContainer.appendChild(form);
}

const showForm = () => {
    if (!IsFormOpen) {
        makeForm({}, form)
        addButton.innerText = "Hide Input Form"
        IsFormOpen = true
    }
    else {

        formContainer.innerHTML = "";
        addButton.innerText = "Show Input Form"
        IsFormOpen = false
    }
}

const deletePosts = async (id) => {
    try {
        await fetch(baseURL + `/posts/${id}`);
        await fetchData;
        alert("Deleted this post successfully");
    }
    catch (ex) {
        alert(ex.message)
    }
}

const updatePosts = async (event) => {

    event.preventDefault();
    const formData = new FormData(editForm);
    const postInfo = {
        title: formData.get('title'),
        body: formData.get('body'),
        userId: formData.get("userId"),
        id: formData.get("id")
    };

    try {
        await fetch(baseURL + `/posts/${postInfo.id}`, {
            method: 'PUT',
            body: JSON.stringify(postInfo),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        editForm.innerHTML = ""
        IsFormOpen = false
        alert("Updated successfully")

    }
    catch (ex) {
        alert.ex(ex.message)
    }
}

function editPosts(postInfo) {
    makeForm(postInfo, editForm)
}

const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
};

const searchPosts = debounce(async (event) => {
    const searchText = searchBox.value.trim().toLowerCase();
    let searchResult = postData.filter((post) => {
        let title = post.title.toLowerCase();
        return title.includes(searchText)
    });
    renderPosts(searchResult)
}, 300)

showButton.addEventListener("click", fetchData)
addButton.addEventListener("click", showForm)
form.addEventListener("submit", addPost)
editForm.addEventListener("submit", updatePosts)
searchBox.addEventListener("keypress", searchPosts);