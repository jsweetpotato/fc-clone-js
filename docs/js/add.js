function getToken() {
  return localStorage.getItem('token');
}

async function getUserByToken(token) {
  try {
    const res = await axios.get('https://api.marktube.tv/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  } catch (error) {
    console.log('getUserByToken error', error);
    return null;
  }
}

async function save(e) {
  e.preventDefault();
  e.stopPropagation();
  console.log('save');

  e.target.classList.add('was-validated'); //bootstrap valid css classlist

  // get books information
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

  // Post book information to server
  try {
    await axios.post('https://api.marktube.tv/v1/book', {
      title,
      message,
      author,
      url
    }, {
      headers: {
        Authorization: `Bearer ${token}` // 인증된 사람만 요청을 보낼 수 있게 Authorization 토큰도 같이 보냄
      }
    });
    location.assign('/');
  } catch (error) {
    console.log('save error', error);
    alert('책 추가 실패');
  }
}

function bindSaveButton() {
  const form = document.querySelector('#form-add-book');
  form.addEventListener('submit', save);
}

async function main() {
  // 버튼에 이벤트 연결
  bindSaveButton();

  // 토큰 체크
  const token = getToken();
  if (token === null) {
    location.assign('/login');
    return;
  }

  // 토큰으로 서버에서 나의 정보 받아오기
  const user = await getUserByToken(token);
  if (user === null) {
    localStorage.clear();
    location.assign('/login');
    return;
  }
}

document.addEventListener('DOMContentLoaded', main);