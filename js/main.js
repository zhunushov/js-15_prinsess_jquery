let API = "http://localhost:8000/movies"
// переменные для добавление фильма для input ов
let inpTitle = $('#title')
let inpImg = $('#img')
let inpDesc = $('#desc')
let inpPrice = $('#price')
let addbtn = ('#btn-add')
let list = $('.list')
//! seach/ поиск 
let searchInp = $('.search-inp')
let searchVal = "" // сохряняем значение из инпута поиска
//! перехот на страниц
let currentPage  =1; // текушшая странтца
let pageTotalCount = 1; // обшее количество страниц
let paginationList = $(".pagination-list") // блок куда
//добавляюся кнопки с цифрами  для переклюение страницам
let prev = $('.prev')
let next = $(".next")
// ! кнопка измнеие 
// переменные для добавление фильма для input ов  для редакьтрование
let editTitle = $('#edit-title')
let editImg = $('#edit-img')
let editDesc = $('#edit-desc')
let editPrice = $('#edit-price')
let editSaveBtnNew = $('#btn-save-edit')
let editFormModal = $('#editFormModal')
//todo-отображение товаров на странице
render()
function render(){
     fetch(`${API}?q=${searchVal}&_limit=2&_page=${currentPage}`)
    .then(res => res.json())
    .then(data => {
        list.html('')
        data.forEach(item => {
           let elem = movieCard(item)
           list.append(elem)
        });
        drawPaginationButtons()
    })
}
//todo Возврашает верстку карточки для каждого фильма
function movieCard (movie){
    return`
    <div class="card col-4 mx-3 mb-3" style="width: 18rem;">
    <img src="${movie.img}" class="card-img-top movie-img" alt="...">
    <div class="card-body">
      <h5 class="card-title">${movie.title}</h5>
      <a href="#" class="card-link">
      <h6>$ ${movie.price}</h6>
      </a>
      <p class="card-text">${movie.desc}</p>
      <button data-bs-toggle="modal" data-bs-target="#editFormModal" class="btn btn-info btn-edit" id="${movie.id}">Edit</button>
      <button class="btn btn-danger btn-delete" type="button" id="${movie.id}">Delete</button>
    </div>
    </div>`
}
//TODO SEARCH функция срабатывает на каждый ввод
searchInp.on('input', ()=>{
    searchVal = searchInp.val() // записывает значение поиска в переменную searchVal 
  render()// новая перерисовка страницы
})
// todo POGINATION  
function drawPaginationButtons(){ 
    fetch(`${API}?q=${searchVal}`)// запрос на страницы 
    .then(res => res.json())
    .then((data)=> {
      pageTotalCount = Math.ceil(data.length / 2)
      paginationList.html("")
     //   console.log(pageTotalCount);
    for(let i = 1; i <= pageTotalCount; i++){
       if(currentPage== i){
        paginationList.append(`
        <li class="page-item active">
            <a class="page-link page_number" href="#">${i}</a>
        </li>
        `)
       }else{
        paginationList.append(`
        <li class="page-item">
            <a class="page-link page_number" href="#">${i}</a>
        </li>
        `)
       }
    }
  })
}
prev.on("click",()=> {
      if(currentPage <= 1){
           return
      }
      currentPage--
      render()
})
next.on("click",()=> {
      if(currentPage >= pageTotalCount){
           return
      }
      currentPage++
      render()
})
$('body').on("click", ".page_number", function(){
    currentPage = this.innerText
    render()
})
$('body').on("click", ".btn-edit", function(){
    fetch(`${API}/${this.id}`)
    .then(res => res.json())
    .then((data)=> {
        editTitle.val(data.title)
        editImg.val(data.img)
        editPrice.val(data.price)
        editDesc.val(data.desc)
        editSaveBtnNew.attr("id", data.id)
    })
    render()
})

$('#btn-add').on("click", function(){
    // console.log(this);
    let  title = inpTitle.val()
    let  price = inpPrice.val()
    let  img = inpImg.val()
    let  desc = inpDesc.val()
    if((!title || !desc || !img || !price)){
        alert('заполните все поле')
        return
    }
      let post= {
          title: title,
          price: price,
          img: img,
          desc: desc
      }
      fetch(API, {
        method: "POST",
        headers: {
      "Content-type" : 'application/json;charset=utf-8'
      },
      body: JSON.stringify(post),
    }).then(()=> {
        render()
        $("#addFormModal").modal('hide')
    })
    inpDesc.val('')
    inpPrice.val('')
    inpTitle.val('')
    inpImg.val('')
 
})

// сохранить измнение товара 
editSaveBtnNew.on("click", function(){
    let id = this.id
    let  title = editTitle.val()
    let  price = editPrice.val()
    let  img = editImg.val()
    let  desc = editDesc.val()
    if(!title || !desc || !img || !price){
    return
    }
    let editMovie = {
       title: title,
        desc,
        price,
        img
    }
    saveEdit(editMovie, id)
})
// функция для соххранение 
function saveEdit(editMovie, id){
    fetch(`${API}/${id}`, {
        method: 'PATCH',
        headers: {
            "Content-type": 'application/json'

        },
        body: JSON.stringify(editMovie)
    }).then(()=>{
        render()
        $("#editFormModal").modal('hide')
    })
}
$('body').on("click", '.btn-delete',function(){
    fetch(`${API}/${this.id}`,{
        method: 'DELETE',
    }).then(()=> render())
})
