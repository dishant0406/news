//onlooad function to load the categories
const categories = [
  {
    name: 'All',
    value: 'all'
  },
  {
    name: 'National',
    value: 'national'
  },
  {
    name: 'Business',
    value: 'business'
  },
  {
    name: 'Sports',
    value: 'sports'
  },
  {
    name: 'World',
    value: 'world'
  },
  {
    name: 'Politics',
    value: 'politics'
  },
  {
    name: 'Startup',
    value: 'startup'
  },
  {
    name: 'Technology',
    value: 'technology'
  },
  {
    name: 'Entertainment',
    value: 'entertainment'
  },
  {
    name: 'Miscellaneous',
    value: 'miscellaneous'
  },
  {
    name: 'Hatke',
    value: 'hatke'
  },
  {
    name: 'Science',
    value: 'science'
  },
  {
    name: 'Automobile',
    value: 'automobile'
  }
]

const goToNews = () => {
  window.location.href = 'news.html'
}

//function to check button is disabled or not
const checkButton = () => {
  let categories = localStorage.getItem('categories')
  if (categories) {
    categories = categories.split(',')
    if (categories.length > 0) {
      document.getElementById('next').disabled = false
    }
    else {
      document.getElementById('next').disabled = true
    }
  }
  else {
    document.getElementById('next').disabled = true
  }
}

const setCategory = (category, name) => {
  let categories = localStorage.getItem('categories')
  if (categories) {
    categories = categories.split(',')
  }
  else {
    categories = []
  }
  if (categories.includes(category)) {
    //remove from the array
    categories.splice(categories.indexOf(category), 1)
    //remove class from the div from the value inside euqal to name
    let div = document.getElementById(category)
    div.classList.remove('pref_selected')
    localStorage.setItem('categories', categories.join(','))
  }
  else {

    if (category === 'all') {

      //remove pref_selected class from all the divs
      categories.forEach(category => {
        console.log(category)
        let div = document.getElementById(category)
        div.classList.remove('pref_selected')
      })
      categories = []
      categories.push(category)
      let div = document.getElementById(category)
      div.classList.add('pref_selected')
      localStorage.setItem('categories', categories.join(','))
      return
    }

    if (categories.includes('all')) {
      categories.splice(categories.indexOf('all'), 1)
      let div = document.getElementById('all')
      div.classList.remove('pref_selected')
    }

    categories.push(category)
    let div = document.getElementById(category)
    div.classList.add('pref_selected')
    localStorage.setItem('categories', categories.join(','))
  }
  checkButton()
}

const loadSelectedCategories = () => {
  let categories = localStorage.getItem('categories')
  if (categories) {
    categories = categories.split(',')
    categories.forEach(category => {
      let div = document.getElementById(category)
      div.classList.add('pref_selected')
    })
  }
  checkButton()
}


//function to load the categories
function loadCategories() {
  let category_div = document.getElementById('pref')
  let category_html = ''
  categories.forEach(category => {
    category_html += `<div id="${category.value}" class="pref_pill" onclick="setCategory('${category.value}')">${category.name}</div>`
  });
  category_div.innerHTML = category_html
}

window.onload = function () {
  console.log('loaded')
  loadCategories()
  loadSelectedCategories()
}