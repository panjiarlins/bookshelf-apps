const STORAGE_KEY = "BOOKSHELF_APPS";
let bookShelf = [];

function isStorageExist(){
    if(typeof(Storage) === undefined){
        alert("Browser kamu tidak mendukung local storage");
        return false
    }
    return true;
}

function saveData(){
    const parsed = JSON.stringify(bookShelf);
    localStorage.setItem(STORAGE_KEY, parsed);
}

function loadDataFromStorage(){
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
    if(data !== null) bookShelf = data;
}

function updateDataToStorage(){
    if(isStorageExist()) saveData();
}

function composeToObject(title, author, year, isComplete){
	return {
        id: +new Date(),
        title,
        author,
        year,
        isComplete
    };
}

function searchBookByTitle(event){
	event.preventDefault();
	let title = document.getElementById("searchBookTitle").value;
    let bookFound = [];
	if(title != ""){
		for(book of bookShelf){
			if(book.title.toLowerCase().includes(title.toLowerCase())) bookFound.push(book);
		}
		return display(bookFound);
	}
	return display();
}

function input(event){
	event.preventDefault();
	let title = document.getElementById('inputBookTitle').value;
    let author = document.getElementById('inputBookAuthor').value;
	let year =  document.getElementById('inputBookYear').value;
	let isComplete = document.getElementById('inputBookIsComplete').checked;

	if(title == "" || author == "" || year == ""){
		return alert("TIDAK BOLEH ADA DATA YANG KOSONG !");
	}

	let tempObject = composeToObject(title, author, year, isComplete);
	bookShelf.push(tempObject);
	updateDataToStorage();
	display();
	
	document.getElementById('inputBookTitle').value = "";
	document.getElementById('inputBookAuthor').value = "";
	document.getElementById('inputBookYear').value = "";
	document.getElementById('inputBookIsComplete').checked = false;
	document.getElementById('submit-rak').innerHTML = "<b>BELUM SELESAI DIBACA</b>";
}

function inputEditResult(){
	let getID = event.target.id.replace("save", "");
	let getElement = document.querySelectorAll(`#id${getID} input`);
	for(book of bookShelf){
		if(book.id == getID){
			book.title = getElement[0].value;
			book.author = getElement[1].value;
			book.year = getElement[2].value;

			break;
		}
	}

	editInputBox(`id${getID}`, true);
	updateDataToStorage();
	display();
}

function display(objects = bookShelf){
    loadDataFromStorage();

    let completeContainer = document.getElementById("completeBookshelfList");
    let incompleteContainer = document.getElementById("incompleteBookshelfList");
    
    incompleteContainer.innerHTML = "";
    completeContainer.innerHTML = "";
    
    for(book of objects){
        if(book.isComplete == false){
            incompleteContainer.innerHTML += `<article id="id${book.id}" class="card-input">
					<div><input class="output" type="text" value="${book.title}" required disabled></div>
                    <div><p>Penulis:</p><input class="output" type="text" value="${book.author}" required disabled></div>
                    <div><p>Tahun:</p><input class="output" type="number" value="${book.year}" required disabled></div>
                    <div class="action">
                        <button onClick="completeOrIncomplete(${book.id}, true)" class="card button-small">Selesai di Baca</button>
                        <button onClick="remove(${book.id})" class="card button-small">Hapus buku</button>
                        <button id="edit${book.id}" onClick="editInputBox('id${book.id}', false)" class="card button-small" style="display: initial;">Edit buku</button>
						<button id="save${book.id}" onClick="inputEditResult()" class="card button-small" style="display: none;">Simpan Hasil Edit</button>
                    </div>
                </article>`;
		}
		else{
            completeContainer.innerHTML += `<article id="id${book.id}" class="card-input">
					<div><input class="output" type="text" value="${book.title}" required disabled></div>
					<div><p>Penulis:</p><input class="output" type="text" value="${book.author}" required disabled></div>
					<div><p>Tahun:</p><input class="output" type="number" value="${book.year}" required disabled></div>
                    <div class="action">
                        <button onClick="completeOrIncomplete(${book.id}, false)" class="card button-small">Belum selesai di Baca</button>
                        <button onClick="remove(${book.id})" class="card button-small">Hapus buku</button>
                        <button id="edit${book.id}" onClick="editInputBox('id${book.id}', false)" class="card button-small" style="display: initial;">Edit buku</button>
						<button id="save${book.id}" onClick="inputEditResult()" class="card button-small" style="display: none;">Simpan Hasil Edit</button>
                    </div>
                </article>`;
		}
	}
}
display();

function completeOrIncomplete(id, isComplete){
    for(book of bookShelf){
        if(book.id == id){
            book.isComplete = isComplete;
			updateDataToStorage();
            display();
        }
    }
}

function editInputBox(id, isDisabled){
	id = id.replace("id", "");
	for(i of document.querySelectorAll(`#id${id} input`)){
		if(isDisabled){
			i.setAttribute('disabled', true);
			i.style.backgroundColor = "white";
			document.getElementById(`edit${id}`).style.display = "initial";
			document.getElementById(`save${id}`).style.display = "none";
		}
		else{
			i.removeAttribute('disabled');
			i.style.backgroundColor = "#E5DCC3";
			document.getElementById(`edit${id}`).style.display = "none";
			document.getElementById(`save${id}`).style.display = "initial";
		}
	}

	document.querySelector(`#id${id} input`).focus();
}

function remove(id){
	let i = 0;
	for(book of bookShelf){
		if(book.id == id) break;
		i++;
	}
	bookShelf.splice(i, 1);
	updateDataToStorage();
	display();
}

function showInput(event, isShowInput){
	event.preventDefault();
	let element = document.querySelectorAll("main > section");

	element[0].style.display = isShowInput? "inherit" : "none";
	element[1].style.display = isShowInput? "none" : "inherit";
	element[2].style.display = isShowInput? "none" : "inherit";
	element[3].style.display = isShowInput? "none" : "inherit";
}
document.querySelector("header li").click();

document.getElementById("inputBookIsComplete").addEventListener('change', function(event){
	if (event.currentTarget.checked) {
		document.getElementById("submit-rak").innerHTML = "<b>SELESAI DIBACA</b>";
	} else {
		document.getElementById("submit-rak").innerHTML = "<b>BELUM SELESAI DIBACA</b>";
	}
});

document.addEventListener('DOMContentLoaded', function() {
    display();
});