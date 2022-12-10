// studentModal.open = true // funciona para abrir o dialog
// studentModal.open = false// funciona para fechar o dialog
// studentModal.setAttribute('open', true) // funciona para abrir o dialog
// studentModal.setAttribute('open', false) // não funciona para fechar o dialog
// studentModal.removeAttribute('open') funciona para fechar o dialog
// studentModal.showModal() // funciona para abrir o dialog
// studentModal.close() funciona para fechar o dialog

const studentModal = document.querySelector('#student-modal');
const studentForm = document.querySelector('#student-form');
const studentModalTitle = document.querySelector('#student-modal-title')
const saveStudentButton = document.querySelector('#save-student')
const subjectModal = document.querySelector('#subject-modal');
const subjectForm = document.querySelector('#subject-form');
const subjectModalTitle = document.querySelector('#subject-modal-title')
const saveSubjectButton = document.querySelector('#save-subject')


/**
 * Função responsável abrir o modal de estudante
 */
const openStudentModal = () => studentModal.showModal();

/**
 * Função responsável fechar o modal de estudante
 */
const closeStudentModal = () => studentModal.close();

/**
 * Função responsável abrir o modal de Disciplina
 */
const openSubjectModal = () => subjectModal.showModal();
/**
 * Função responsável fechar o modal de Disciplina
 */
const closeSubjectModal = () => subjectModal.close();

/**
 * Função responsável por criar linhas na tabela student-table
 * @param {nome} string
 * @param {matricula} string
 * @param {curso} string
 * @param {id} string
 */
const createStudentTableRow = (nome, matricula, curso, id) => {
  const studentTable = document.querySelector('#student-table tbody')
  const tableTr = document.createElement('tr');
  tableTr.innerHTML = ` 
  <td>${nome}</td>
  <td>${matricula}</td>
  <td>${curso}</td>
  <td align="center">
    <button class="button button--danger" onclick=deleteStudentTable(${id})>Apagar</button>
    <button class="button button--success" onclick="editdStudentModal(${id})">Editar</button>
  </td>`;
  studentTable.appendChild(tableTr);
}



/**
 * Função responsável savar os dados de um estudante
 * @param {url} string
 * @param {method} string
 */
const saveStundentData = (url, method) => {
  studentForm.addEventListener('submit', (event)=> {
    event.preventDefault();
    const formData = new FormData(studentForm);
    const payload = new URLSearchParams(formData);
    fetch(url, {
        method: method,
        body: payload
    })
    .catch(error => {
        closeStudentModal();
        alert('ocorreu um erro tente mais tarde')
        console.error(error);
    })
    // const inputs = document.querySelectorAll('input') // pega todos os iputs
    // console.log(inputs[0].value) // acessa o primeiro indice do array de inputs
  });
}

/**
 * Função responsável abrir o modal de aluno e salvar um novo aluno
 * @param {studentId} string
 */
const createStudent = () => {
  openStudentModal();
  studentModalTitle.textContent = 'Novo Aluno';
  saveStudentButton.textContent = 'Criar';
  saveStundentData('http://localhost:3000/alunos',  'POST');
}

/**
 * Função responsável abrir o modal de edição e carregar os dados de um estudante e salvar os dados da edição
 * @param {studentId} string
 */
 const editdStudentModal = async (studentId)  => {
  const url = `http://localhost:3000/alunos/${studentId}`;
  openStudentModal();
  studentModalTitle.textContent='Editar aluno';
  saveStudentButton.textContent = 'Editar';
  const [name, matricula] = document.querySelectorAll('input');
  const selectCurso =  document.querySelector("#curso");
  fetch(url)
  .then(resp => resp.json())
  .then(data => {
   name.value = data.nome
   matricula.value = data.matricula
   selectCurso.value =  data.curso
  })
  saveStundentData(url,  'PUT');
 };

/**
 * Função responsável por apagar dados de um estutande
 * @param {studentId} string
 */
const deleteStudentTable = async (studentId)  =>  
  fetch(`http://localhost:3000/alunos/${studentId}`, {method : 'DELETE'});

/**
 * Função responsável por carregar os dados da student-table
 */
const loadStudentTable = () => {
  fetch('http://localhost:3000/alunos')
  .then(resp => resp.json())
  .then(data => {
    data.forEach(item => {
      createStudentTableRow(item.nome, item.matricula, item.curso, item.id)
    })
  }).catch((error) => {
    alert('ocorreu um erro tente mais tarde')
    console.error(error);
  });
};

/**
 * Função responsável por carregar os cards
 */
const loadSubjectCardList = () => {
  fetch('http://localhost:3000/disciplinas')
  .then(resp => resp.json())
  .then(data => {
    data.forEach(item => {
      createSubjectCard(item.id, item.nome, item.cargaHoraria, item.professor, item.status, item.observacos)
    })
  }).catch((error) => {
    alert('ocorreu um erro tente mais tarde')
    console.error(error);
  });
};


/**
 * Função responsável por criar cards na Subject list
 * @param {id} string
 * @param {nome} string
 * @param {cargaHoraria} string
 * @param {professor} string
 * @param {status} string
 * @param {observacos} string
 */
const createSubjectCard = (id, nome, cargaHoraria, professor, status, observacos) => {
const subjectCard = document.querySelector('#subject-list');
const subjectDiv = document.createElement('div');
subjectDiv.innerHTML =
  `
  <div class="subject-card">
    <h3 class="subject-card__title">${nome}</h3>
    <hr />
    <ul class="subject-card__list">
      <li>Carga horária: ${cargaHoraria}</li>
      <li>Professor: ${professor}</li>
      <li>Status: <span class="tag ${status === 'Opcional' ? 'tag--success' : 'tag--danger'} ">${status}</span></li>
    </ul>
    <p>${observacos}</p>
    <div class="subject-card--button">
      <button class="button button--danger" onclick="deleteSubjectCard(${id})">Apagar</button>
      <button class="button button--success" onclick="editdSubjectModal(${id})">Editar</button>
    </div>
  </div>
`;
subjectCard.appendChild(subjectDiv);
}


 
/**
 * Função responsável por abrir o modal disciplina e criar uma nova disciplina
 */

const createSubject = () => {
  openSubjectModal();
  subjectModalTitle.textContent = 'Nova Disciplina';
  saveSubjectButton.textContent = 'Criar';
  saveSubjectData('http://localhost:3000/disciplinas',  'POST');
}

/**
 * Função responsável salvar os dados de uma disciplina
 * @param {url} string
 * @param {method} string
 */
 const saveSubjectData = (url, method) => {
  subjectForm.addEventListener('submit', (event)=> {
    event.preventDefault();
    const formData = new FormData(subjectForm);
    const payload = new URLSearchParams(formData);
    fetch(url, {
        method: method,
        body: payload
    })
    .then(() => {
      subjectForm.reset();
      closeSubjectModal();
      clearSubjectCards();
      loadSubjectCardList();
    })
    .catch(error => {
        closeSubjectModal();
        alert('ocorreu um erro tente mais tarde')
        console.error(error);
    })
  });
}

/**
 * Função responsável abrir o modal de edição e carregar os dados de uma disciplina e salvar os dados da edição
 * @param {id} string
 */
 const editdSubjectModal = async (id)  => {
  const url = `http://localhost:3000/disciplinas/${id}`;
  openSubjectModal();
  subjectModalTitle.textContent='Editar disciplina';
  saveSubjectButton.textContent = 'Editar';
  const nome =  document.querySelector('#nome');
  const cargaHoraria =  document.querySelector('#cargaHoraria');
  const professor =  document.querySelector('#professor');
  const status =  document.querySelector("#status");
  const observacao = document.querySelector('#observacos');
  fetch(url)
  .then(resp => resp.json())
  .then(data => {
    nome.value = data.nome
    cargaHoraria.value = data.cargaHoraria
    professor.value = data.professor
    status = data.status
    observacao = data.obserevacos
  })
  saveSubjectData(url,  'PUT');
 };

 const clearSubjectCards = () => {
  const subjectList = document.querySelector('#subject-list');
  subjectList.innerHTML = '';
}


 /**
 * Função responsável por apagar dados de uma disciplina
 * @param {id} string
 */
 function deleteSubjectCard(id) {
  fetch(`http://localhost:3000/disciplinas/${id}`, {method : 'DELETE'})
  .then(() => {
    clearSubjectCards();
    loadSubjectCardList();
  })
  .catch(error => {
    alert('ocorreu um erro tente mais tarde');
    console.error(error);
  });
}

loadSubjectCardList();
loadStudentTable();
