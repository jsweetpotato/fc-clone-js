function getToken() {
  return localStorage.getItem('token');
}

async function getUserByToken(token) {
  try {
    const res = await axios.get('https://api.marktube.tv/v1/book', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error) {
    console.log('getUserByToken', error);
    return null;
  }
}

async function getBook(bookId) {
  const token = getToken();
  if (token === null) {
    location.assign('/login');
  }
  try {
    const res = await axios.get(`https://api.marktube.tv/v1/book/${bookId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  } catch (error) {
    console.log('getBook error', error);
    return null;
  }
} 

async function updateBook(bookId) {
  const titleElem = document.querySelector('#title');
  const messageElem = document.querySelector('#message');
  const authorElem = document.querySelector('#author');
  const urlElem = document.querySelector('#url');

  const title = titleElem.value;
  const message = messageElem.value;
  const author = authorElem.value;
  const url = urlElem.value;

  if (title === '' || message === '' || author === '' || url === '') {
    alert('입력칸을 다 채워주세요!');
    return;   
  }

  const token = getToken();
  if (token === null) {
    location.assign('/login');
    return;
  }

  await axios.patch(`https://api.marktube.tv/v1/book/${bookId}`, {
    title,
    message,
    author,
    url
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })
}

function render(book) {
  const titleElem = document.querySelector('#title');
  titleElem.value = book.title;
  
  const messageElem = document.querySelector('#message');
  messageElem.value = book.message;
   
  const authorElem = document.querySelector('#author');
  authorElem.value = book.author;
   
  const urlElem = document.querySelector('#url');
  urlElem.value = book.url;
 
  const form = document.querySelector('#form-edit-book');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    e.stopPropagation();
    e.target.classList.add('was-validated');

    try {
      await updateBook(book.bookId);
      location.assign(`book?id=${book.bookId}`);
    } catch (error) {
      console.log('책 편집에 실패하였습니다.', error);
    }
  });

  const cancelBtnElem = document.querySelector('#btn-cancel');
  cancelBtnElem.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();

    location.assign(`book?id=${book.bookId}`);
  })

}

async function main() {
  // 브라우저에서 id 가져오기
  const bookId = new URL(location.href).searchParams.get('id');
  
  // 토큰 체크
    const token = getToken();
  if (token === null) {
    location.href = '/login';
    return;
  }

  // 토큰으로 서버에서 나의정보 받아오기
  const user = await getUserByToken(token);
  if (user === null) {
    localStorage.clear();
    location.href = '/login';
    return;
  }

  // 책을 서버에서 받아오기
  const book = await getBook(bookId);
  if (book === null) {
    alert('서버에서 책 가져오기 실패');
    return;
  }

  console.log(book);
  // 받아온 책을 그리기
  render(book);
}

document.addEventListener('DOMContentLoaded', main);