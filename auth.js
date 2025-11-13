// ==========================
// 전역 상태: 회원 정보 배열
// ==========================
const users = []; // { id: string, password: string } 객체들을 저장

// ==========================
// DOM 요소 선택
// ==========================

// 탭 버튼
const $showSignupBtn = document.getElementById("show-signup");
const $showLoginBtn = document.getElementById("show-login");

// 섹션
const $signupSection = document.getElementById("signup-section");
const $loginSection = document.getElementById("login-section");

// 회원가입 폼 & 입력 요소
const $signupForm = document.getElementById("signup-form");
const $signupIdInput = document.getElementById("signup-id");
const $signupPasswordInput = document.getElementById("signup-password");
const $signupPasswordConfirmInput = document.getElementById(
  "signup-password-confirm"
);

// 회원가입 메시지 요소
const $signupIdMessage = document.getElementById("signup-id-message");
const $signupPasswordMessage = document.getElementById(
  "signup-password-message"
);
const $signupPasswordConfirmMessage = document.getElementById(
  "signup-password-confirm-message"
);
const $signupResultMessage = document.getElementById("signup-result-message");

// 로그인 폼 & 입력 요소
const $loginForm = document.getElementById("login-form");
const $loginIdInput = document.getElementById("login-id");
const $loginPasswordInput = document.getElementById("login-password");
const $loginResultMessage = document.getElementById("login-result-message");

// ==========================
// 섹션 전환 함수
// ==========================
function showSignupSection() {
  $signupSection.classList.remove("hidden");
  $loginSection.classList.add("hidden");
  $showSignupBtn.classList.add("active");
  $showLoginBtn.classList.remove("active");

  clearMessages();
}

function showLoginSection() {
  $signupSection.classList.add("hidden");
  $loginSection.classList.remove("hidden");
  $showSignupBtn.classList.remove("active");
  $showLoginBtn.classList.add("active");

  clearMessages();
}

// 공통 메시지 초기화
function clearMessages() {
  $signupResultMessage.textContent = "";
  $signupResultMessage.className = "section-message";

  $loginResultMessage.textContent = "";
  $loginResultMessage.className = "section-message";
}

// 탭 버튼 이벤트
$showSignupBtn.addEventListener("click", showSignupSection);
$showLoginBtn.addEventListener("click", showLoginSection);

// ==========================
// 비밀번호 규칙 체크 함수
// (나만의 규칙)
// - 8자 이상
// - 영문자 1개 이상
// - 숫자 1개 이상
// - 특수문자(!@#$%^&*) 1개 이상
// ==========================
function validatePasswordRule(password) {
  const hasMinLength = password.length >= 8;
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*]/.test(password);

  const isValid = hasMinLength && hasLetter && hasNumber && hasSpecial;

  return {
    isValid,
    hasMinLength,
    hasLetter,
    hasNumber,
    hasSpecial,
  };
}

// 비밀번호 입력 시 실시간으로 규칙 체크
$signupPasswordInput.addEventListener("input", () => {
  const value = $signupPasswordInput.value;
  const result = validatePasswordRule(value);

  if (value === "") {
    $signupPasswordMessage.textContent =
      "비밀번호 규칙: 8자 이상, 영문자, 숫자, 특수문자(!@#$%^&*) 각각 1개 이상 포함";
    $signupPasswordMessage.className = "input-message";
    return;
  }

  if (result.isValid) {
    $signupPasswordMessage.textContent = "사용 가능한 비밀번호입니다.";
    $signupPasswordMessage.className = "input-message success";
  } else {
    let msg = "※ 비밀번호 조건을 만족하지 않습니다: ";

    const fails = [];
    if (!result.hasMinLength) fails.push("8자 이상");
    if (!result.hasLetter) fails.push("영문자 1개 이상");
    if (!result.hasNumber) fails.push("숫자 1개 이상");
    if (!result.hasSpecial) fails.push("특수문자(!@#$%^&*) 1개 이상");

    msg += fails.join(", ");
    $signupPasswordMessage.textContent = msg;
    $signupPasswordMessage.className = "input-message error";
  }
});

// 비밀번호 확인 입력 시 일치 여부 체크
$signupPasswordConfirmInput.addEventListener("input", () => {
  const pw = $signupPasswordInput.value;
  const confirmPw = $signupPasswordConfirmInput.value;

  if (confirmPw === "") {
    $signupPasswordConfirmMessage.textContent = "비밀번호를 다시 입력해주세요.";
    $signupPasswordConfirmMessage.className = "input-message";
    return;
  }

  if (pw === confirmPw) {
    $signupPasswordConfirmMessage.textContent = "비밀번호가 일치합니다.";
    $signupPasswordConfirmMessage.className = "input-message success";
  } else {
    $signupPasswordConfirmMessage.textContent = "비밀번호가 일치하지 않습니다.";
    $signupPasswordConfirmMessage.className = "input-message error";
  }
});

// ==========================
// 아이디 중복 체크 함수
// ==========================
function isDuplicateId(id) {
  return users.some((user) => user.id === id);
}

// 아이디 입력 시 기본 안내
$signupIdInput.addEventListener("input", () => {
  const id = $signupIdInput.value.trim();
  if (id.length === 0) {
    $signupIdMessage.textContent = "아이디는 3자 이상 입력하세요.";
    $signupIdMessage.className = "input-message";
    return;
  }

  if (id.length < 3) {
    $signupIdMessage.textContent = "3자 이상 입력해야 합니다.";
    $signupIdMessage.className = "input-message error";
    return;
  }

  if (isDuplicateId(id)) {
    $signupIdMessage.textContent = "이미 사용 중인 아이디입니다.";
    $signupIdMessage.className = "input-message error";
  } else {
    $signupIdMessage.textContent = "사용 가능한 아이디입니다.";
    $signupIdMessage.className = "input-message success";
  }
});

// ==========================
// 회원가입 폼 제출 이벤트
// ==========================
$signupForm.addEventListener("submit", (event) => {
  event.preventDefault(); // 새로고침 방지

  const id = $signupIdInput.value.trim();
  const pw = $signupPasswordInput.value;
  const pwConfirm = $signupPasswordConfirmInput.value;

  // 1) 아이디 유효성
  if (id.length < 3) {
    $signupResultMessage.textContent = "아이디는 3자 이상이어야 합니다.";
    $signupResultMessage.className = "section-message error";
    return;
  }

  if (isDuplicateId(id)) {
    $signupResultMessage.textContent = "이미 사용 중인 아이디입니다.";
    $signupResultMessage.className = "section-message error";
    return;
  }

  // 2) 비밀번호 규칙 확인
  const pwCheck = validatePasswordRule(pw);
  if (!pwCheck.isValid) {
    $signupResultMessage.textContent =
      "비밀번호 규칙을 만족하지 않습니다. 안내 메시지를 확인해주세요.";
    $signupResultMessage.className = "section-message error";
    return;
  }

  // 3) 비밀번호 확인 일치 여부
  if (pw !== pwConfirm) {
    $signupResultMessage.textContent =
      "비밀번호와 비밀번호 확인이 일치하지 않습니다.";
    $signupResultMessage.className = "section-message error";
    return;
  }

  // 4) 모든 조건 통과 → users 배열에 저장
  users.push({
    id,
    password: pw,
  });

  $signupResultMessage.textContent =
    "회원가입이 완료되었습니다. 이제 로그인해주세요.";
  $signupResultMessage.className = "section-message success";

  // 입력값 초기화
  $signupIdInput.value = "";
  $signupPasswordInput.value = "";
  $signupPasswordConfirmInput.value = "";

  // 안내 메시지도 초기화
  $signupIdMessage.textContent = "아이디는 3자 이상 입력하세요.";
  $signupIdMessage.className = "input-message";

  $signupPasswordMessage.textContent =
    "비밀번호 규칙: 8자 이상, 영문자, 숫자, 특수문자(!@#$%^&*) 각각 1개 이상 포함";
  $signupPasswordMessage.className = "input-message";

  $signupPasswordConfirmMessage.textContent = "비밀번호를 다시 입력해주세요.";
  $signupPasswordConfirmMessage.className = "input-message";

  // 회원가입 성공 후 로그인 탭으로 자동 전환해도 됨 (선호에 따라)
  setTimeout(() => {
    showLoginSection();
    $loginIdInput.value = id; // 방금 가입한 아이디 자동 입력(친절 옵션)
  }, 800);
});

// ==========================
// 로그인 폼 제출 이벤트
// ==========================
$loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const id = $loginIdInput.value.trim();
  const pw = $loginPasswordInput.value;

  // 간단한 검증
  if (id === "" || pw === "") {
    $loginResultMessage.textContent = "아이디와 비밀번호를 모두 입력해주세요.";
    $loginResultMessage.className = "section-message error";
    return;
  }

  const foundUser = users.find(
    (user) => user.id === id && user.password === pw
  );

  if (!foundUser) {
    $loginResultMessage.textContent =
      "아이디 또는 비밀번호가 올바르지 않습니다.";
    $loginResultMessage.className = "section-message error";
    return;
  }

  $loginResultMessage.textContent = `${id}님, 로그인에 성공했습니다!`;
  $loginResultMessage.className = "section-message success";

  // 나중에 여기서 todolist.html로 이동하거나,
  // 같은 페이지에서 todo 섹션을 보여주는 식으로 확장하면 됨.
  // 예: location.href = "todolist.html";
});
