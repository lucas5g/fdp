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
  document.querySelector('#gerar-pdf').style.display = 'block'
  return token
}

document.addEventListener('click', e => {
  if (e.target.id === 'button-save-token') {
    handleSaveToken()
  }
})

document.addEventListener('DOMContentLoaded', async () => {
  const token = verifyToken()
  if (!token) {
    return
  }

  const data = await fetch('https://folha-de-pontos.dizelequefez.com.br/pontos/gerar', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  const { user, days } = await data.json()

  document.querySelector('#name').innerHTML = user.name ?? 'SEM NOME'
  document.querySelector('#masp').innerHTML = user.masp ?? 'SEM MASP'

  const table = document.querySelector('table').getElementsByTagName('tbody')[0]

  for (const row of days) {
    const newLine = table.insertRow()

    newLine.insertCell().innerHTML = row.day
    if (row.dayName === 'SÁBADO' || row.dayName === 'DOMINGO') {
      newLine.insertCell().innerHTML = row.dayName

      for (let i = 0; i < 9; i++) {
        newLine.insertCell().innerHTML = ''
      }

      continue
    }

    newLine.insertCell().innerHTML = row.registers.start
    newLine.insertCell().innerHTML = ''
    newLine.insertCell().innerHTML = row.registers.lunch
    newLine.insertCell().innerHTML = ''
    newLine.insertCell().innerHTML = row.registers.lunchEnd
    newLine.insertCell().innerHTML = ''
    newLine.insertCell().innerHTML = row.registers.end

  }
  console.log(days)



})