const api = 'https://folha-de-pontos.dizelequefez.com.br'

export function handleSaveToken() {
  const token = document.querySelector('#set-token input').value
  console.log({ token })
  localStorage.setItem('jwt', token)
  document.querySelector('#set-token').style.display = 'none'
  document.querySelector('#content').style.display = 'block'
}
function setInfo() {
  const year = new Date().getFullYear()

  document.querySelector('#year').innerHTML = year
}
function generatePDF() {
  const elemento = document.getElementById('content');
  html2pdf().from(elemento).save('pagina.pdf');
}

function verifyToken() {
  const token = localStorage.getItem('jwt')
  if (!token) {
    document.querySelector('#set-token').style.display = 'block'

    return false
  }
  document.querySelector('#set-token').style.display = 'none'
  document.querySelector('#content').style.display = 'block'
  // document.querySelector('#gerar-pdf').style.display = 'block'
  return token
}

async function getSignature(id) {
  const token = verifyToken()
  const data = await fetch(`${api}/users/${id}/signature.png`, {
    // const data = await fetch(`/users/${id}/signature.png`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  const res = await data.arrayBuffer()

  return URL.createObjectURL(new Blob([res]))
}

async function getList(token) {
  const data = await fetch(`${api}/points/generate`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  const { user, days } = await data.json()

  const imageUrl = await getSignature(user.id)

  document.querySelector('#name').innerHTML = user.name ?? 'SEM NOME'
  document.querySelector('#masp').innerHTML = user.masp ?? 'SEM MASP'
  document.querySelector('#month').innerHTML = days[0].month

  const table = document.querySelector('table').getElementsByTagName('tbody')[0]
  const image = `<img src="${imageUrl}" width="45" height="15" />`

  for (const row of days) {
    const newLine = table.insertRow()

    newLine.insertCell().innerHTML = row.day
    if (row.details !== 'TRABALHO') {
      newLine.insertCell().innerHTML = row.details === 'FOLGA' ? row.dayName : row.details

      for (let i = 0; i < 9; i++) {
        newLine.insertCell().innerHTML = ''
      }

      continue
    }

    newLine.insertCell().innerHTML = row.registers.start
    newLine.insertCell().innerHTML = image
    newLine.insertCell().innerHTML = row.registers.lunch
    newLine.insertCell().innerHTML = image
    newLine.insertCell().innerHTML = row.registers.lunchEnd
    newLine.insertCell().innerHTML = image
    newLine.insertCell().innerHTML = row.registers.end
    newLine.insertCell().innerHTML = ''
    newLine.insertCell().innerHTML = ''
    newLine.insertCell().innerHTML = ''

  }
}

document.addEventListener('click', e => {
  if (e.target.id === 'button-save-token') {
    return handleSaveToken()
  }

  if (e.target.id === 'button-gerar-pdf') {
    return generatePDF()
  }
})



document.addEventListener('DOMContentLoaded', async () => {
  const token = verifyToken()
  if (!token) {
    return
  }

  await getList(token)

  setInfo()


})