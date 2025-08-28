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

async function getSignature(id){
  const token = verifyToken()
  const data = await fetch(`https://folha-de-pontos.dizelequefez.com.br/users/${id}/signature.png`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  const res = await data.arrayBuffer()

  return URL.createObjectURL(new Blob([res]))
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

  const imageUrl = await getSignature(user.id)
  

  document.querySelector('#name').innerHTML = user.name ?? 'SEM NOME'
  document.querySelector('#masp').innerHTML = user.masp ?? 'SEM MASP'

  const table = document.querySelector('table').getElementsByTagName('tbody')[0]
  const image = `<img src="${imageUrl}" width="45" height="15" />`

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
  
})