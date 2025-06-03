document.addEventListener('DOMContentLoaded', async () => {
  const bookmarkBtn = document.querySelector('#bookmark-tab');
  const editBtn = document.querySelector('#edit-tab');
  const cardSection = document.querySelector('.card-section');
  const editSection = document.querySelector('.edit-section');

  bookmarkBtn.addEventListener('click', () => {
    cardSection.style.display = 'block';
    editSection.style.display = 'none';
    bookmarkBtn.classList.add('active');
    editBtn.classList.remove('active');
  });

  editBtn.addEventListener('click', () => {
    cardSection.style.display = 'none';
    editSection.style.display = 'block';
    editBtn.classList.add('active');
    bookmarkBtn.classList.remove('active');
  });

  const userId = localStorage.getItem('userId');
  if (!userId) {
    //alert('로그인이 필요합니다.');
    //location.href = 'Login.html';
    //return;
    console.warn('[DEV MODE] 로그인 없이 진입 - 임시 userId 설정');
    userId = 'gildong';  // 실제 존재하는 사용자 ID로 바꿔도 좋아
    localStorage.setItem('userId', userId); // 로그인한 것처럼 위장
  }

  try {
    const res = await fetch(`/user?userId=${encodeURIComponent(userId)}`);
    if (!res.ok) throw new Error('유저 정보 불러오기 실패');

    const user = await res.json();
    document.querySelector('input[name="username"]').value = user.username || '';
    document.querySelector('input[name="user_id"]').value = user.user_id || '';
    document.querySelector('input[name="email"]').value = user.email || '';
    document.querySelector('input[name="password"]').value = user.password || '';

    document.getElementById('user-greeting').textContent = `안녕하세요, ${user.username || '사용자'}님`;
    document.getElementById('user-email').textContent = user.email || '';
  } catch (err) {
    console.error('사용자 정보 불러오기 실패:', err);
    alert('사용자 정보를 불러오는 데 실패했습니다.');
  }

  document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      old_user_id: localStorage.getItem('userId'),
      user_id: document.querySelector('input[name="user_id"]').value,
      username: document.querySelector('input[name="username"]').value,
      password: document.querySelector('input[name="password"]').value,
      email: document.querySelector('input[name="email"]').value
    };

    try {
      const res = await fetch('/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.status === 409) {
        alert('중복된 정보가 있습니다. 다시 확인해주세요.');
        return;
      }

      if (res.ok) {
        const result = await res.json();
        localStorage.setItem('userId', result.new_user_id);

        alert('정보가 성공적으로 수정되었습니다!');

        document.getElementById('user-greeting').textContent = `안녕하세요, ${data.username}님`;
        document.getElementById('user-email').textContent = data.email;
      } else {
        alert('수정 중 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error('수정 요청 실패:', err);
      alert('요청 중 오류가 발생했습니다.');
    }
  });
});

//북마크 js
document.addEventListener('DOMContentLoaded', () => {
  const cardSection = document.getElementById('card-section');

  // 모달 요소 가져오기 ✅
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDescription = document.getElementById('modal-description');
  const modalClose = document.getElementById('modal-close');

  // X 버튼 클릭 시 닫기 ✅
  modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // 배경 클릭 시 닫기 ✅
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  const bookmarks = [
    {
      id: 1,
      name: '나이아신아마이드',
      description: `나이아신아마이드(Niacinamide)는 비타민 B3의 한 형태로, 
피부 톤 개선, 주름 개선, 수분 장벽 강화 등 다양한 효과를 가진 성분입니다. 
특히 미백 기능성 화장품에서 자주 사용되며, 피부 트러블 완화에도 도움을 줍니다.`
    },
    {
      id: 2,
      name: '히알루론산',
      description: `히알루론산(Hyaluronic Acid)은 피부 보습에 핵심적인 성분으로, 
수분을 끌어당기는 능력이 뛰어나 건조함을 막아줍니다. 
노화 방지와 탄력 개선에도 탁월한 효과가 있어 널리 사용됩니다.`
    }
  ];

  // 카드 추가
  bookmarks.forEach((bookmark) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = bookmark.id;

    card.innerHTML = `
      <div class="card-header">
        <strong class="ingredient-name">${bookmark.name}</strong>
        <button class="close-btn"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <p class="card-content">${bookmark.description}</p>
    `;

    card.querySelector('.close-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      card.remove();
    });

    card.addEventListener('click', () => {
      modalTitle.textContent = bookmark.name;
      modalDescription.textContent = bookmark.description;
      modal.style.display = 'flex';
    });

    cardSection.appendChild(card);
  });
});
