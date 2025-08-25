function handleSaveToken() {
  const token = document.querySelector('#set-token input').value
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
    return false
  }
  document.querySelector('#set-token').style.display = 'none'
  document.querySelector('#content').style.display = 'block'
  return token
}

document.addEventListener('DOMContentLoaded', async () => {
  const token = verifyToken()

  fetch('https://fdp.dizelequefez.com.br/pontos/gerar', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      console.log(data)
    })

})