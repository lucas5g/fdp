export function handleSaveToken() {
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
  if(!token){
    return
  }

  fetch('https://folha-de-pontos.dizelequefez.com.br/pontos/gerar', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      console.log(data)
    })

})