let cardHTML = (image, title, description, url, isBookMarked) => {
  return `
  <div id="${url}" class="card">
            <a class="img-card" href="${url}">
            <img src="${image}" />
          </a>
            <div class="card-content">
                <h4 class="card-title">
                    <a href="${url}"> ${title.slice(0, 50)}...
                  </a>
                </h4>
                <p class="">
                    ${description?.slice(0, 65)}...
                </p>
            </div>
            <div class="card-read-more">
                <a href="${url}"} class="btn btn-link btn-block">
                    Read More
                </a>
                <button id='bookmark_btn' class="btn btn-link btn-block">
                  ${isBookMarked ? `<i class="fas fa-bookmark"></i>` : `<i class="far fa-bookmark"></i>`
    }
                </button>
            </div>
        </div>
  `
}

let sideBarItems = [
  {
    name: 'My News',
    icon: 'fas fa-newspaper',
    value: 'my-news'
  },
  {
    name: 'All News',
    icon: 'fas fa-globe',
    value: 'all-news'
  },
  {
    name: 'Bookmarks',
    icon: 'fas fa-bookmark',
    value: 'bookmarks'
  }
]

let selectedTab = 'my-news'

const selectTab = async (value) => {
  selectedTab = value
  setSideBar()
  const dash = document.getElementById('dash')
  dash.innerHTML = ''
  if (value === 'my-news') {

    const categories = getCategoies()
    categories.forEach(async (category) => {
      await setNews(category)
    })
  }
  else if (value === 'all-news') {
    await setNews('all')
  }
  else {
    if (value === 'bookmarks') {
      let bookmarks = getBookmarks()
      let newsHTML = ''
      bookmarks.forEach(element => {
        newsHTML += cardHTML(element.image, element.title, element.description, element.url, true)
      });
      dash.innerHTML = newsHTML
    }
  }
}

const sideBar = (value) => {
  const onClick = `selectTab('${value}')`
  const tab = sideBarItems.find(item => item.value === value)
  if (value === selectedTab) {
    return `
    <button onclick="${onClick}" class="sidebar_item active">${tab.name
      }</button>
    `
  }
  else {
    return `
    <button onclick="${onClick}" class="sidebar_item">${tab.name
      }</button>
    `
  }
}

const getNews = async (category) => {
  let url = `https://inshortsapi.vercel.app/news?category=${category}`
  let response = await fetch(url)
  let data = await response.json()
  return data
}

const getNewsHTML = async (category) => {
  let news = await getNews(category)
  const bookmarks = getBookmarks()
  news = news.data
  let newsHTML = ''
  news.forEach(element => {
    let isBookMarked = bookmarks.find(bookmark => bookmark.url === element.readMoreUrl)
    newsHTML += cardHTML(element.imageUrl, element.title, element.content, element.readMoreUrl, isBookMarked)
  });
  return newsHTML
}

const setNews = async (category) => {
  let newsHTML = await getNewsHTML(category)

  document.getElementById('dash').innerHTML += newsHTML
}

const getCategoies = () => {
  let categories = localStorage.getItem('categories')
  if (categories) {
    return categories.split(',')
  }
  else {
    return []
  }
}

const getBookmarks = () => {
  let bookmarks = localStorage.getItem('bookmarks')
  if (bookmarks) {
    return JSON.parse(bookmarks)
  }
  else {
    return []
  }
}

const setNewsByTab = async () => {
  //refresh the news
  if (selectedTab === 'my-news') {
    const dash = document.getElementById('dash')
    dash.innerHTML = ''
    const categories = getCategoies()
    categories.forEach(async (category) => {
      await setNews(category)
    })
  }
  else if (selectedTab === 'all-news') {
    const dash = document.getElementById('dash')
    dash.innerHTML = ''
    await setNews('all')
  }
  else {
    //bookmarks
  }
}

const bookmarkNews = async (obj) => {
  let bookmarks = getBookmarks()
  const { image, title, description, url } = JSON.parse(obj)

  //check if the news is already bookmarked
  let isBookMarked = bookmarks.find(bookmark => bookmark.url === url)
  if (isBookMarked) {
    bookmarks.splice(bookmarks.indexOf(isBookMarked), 1)
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
    const newsCard = document.getElementById(url)
    newsCard.querySelector('#bookmark_btn').innerHTML = `<i class="far fa-bookmark"></i>`
    if (selectedTab === 'bookmarks') {
      newsCard.remove()
    }
    return
  }

  bookmarks.push({
    image,
    title,
    description,
    url
  })
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks))

  const newsCard = document.getElementById(url)
  newsCard.querySelector('#bookmark_btn').innerHTML = `<i class="fas fa-bookmark"></i>`

}

const setSideBar = () => {
  let sideBarHTML = ''
  sideBarItems.forEach(item => {
    sideBarHTML += sideBar(item.value)
  })

  let div = document.getElementById('news_sidebar')
  div.innerHTML = sideBarHTML
}

window.onload = async () => {
  let categories = getCategoies()
  const dash = document.getElementById('dash')
  dash.innerHTML = ''
  if (categories.length > 0) {
    categories.forEach(async (category) => {
      await setNews(category)
    })
  }
  else {
    await setNews('all')
  }

  setSideBar()

  //add event listener to the bookmark button
  document.addEventListener('click', (event) => {
    if (event.target.id === 'bookmark_btn') {
      let card = event.target.parentElement.parentElement
      let image = card.querySelector('img').src
      let title = card.querySelector('h4').textContent
      let description = card.querySelector('p').textContent
      let url = card.querySelector('a').href
      let obj = {
        image,
        title,
        description,
        url
      }
      bookmarkNews(JSON.stringify(obj))
    }
    //if parent element is bookmark button
    else if (event.target?.parentElement?.id === 'bookmark_btn') {
      let card = event.target.parentElement.parentElement.parentElement
      let image = card.querySelector('img').src
      let title = card.querySelector('h4').textContent
      let description = card.querySelector('p').textContent
      let url = card.querySelector('a').href
      let obj = {
        image,
        title,
        description,
        url
      }
      bookmarkNews(JSON.stringify(obj))
    }
  })
}
