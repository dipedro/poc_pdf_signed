'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const fs = use('fs')

//const HummusRecipe = use('hummus-recipe')

const SignPDF = use('node-signpdf')
const {plainAddPlaceholder, pdflibAddPlaceholder} = use('node-signpdf/dist/helpers')

//import para a biblioteca de juntar pdfs em um só.
//const mergePDF = use('easy-pdf-merge')

const assinador = new SignPDF.SignPdf();

Route.get('/', async () => {

  //const pdfDoc = new HummusRecipe('D:/arquivo/assinar.pdf', 'D:/arquivo/output.pdf');
  //pdfDoc
      // edit 1st page
      //.editPage(1)
      //.text('Pedro assinou essa porra!', 200, 500, {color: '#000000'})
      //.image('D:/arquivo/assinatura.jpg', 200, 650, {width: 250, keepAspectRatio: true})
      //.endPage()
      // end and save
     //.endPDF();

      /**pdfDoc
        .structure('P:/assinatura/pdf-structure.txt')
        .endPDF(done);**/

  let infoSignature = {
    reason: 'Ponto',
    contactInfo: 'pedro.azevedo@iprev.ma.gov.br',
    name: 'Pedro da Silva Azevedo',
    location: 'Coordenadoria de TI - CTI'
  }

  const p12_certificado = fs.readFileSync('D:/arquivo/certificate.p12'); //local do certificado p12
  let pdfBuffer = fs.readFileSync('D:/arquivo/teste.pdf'); //local do pdf que vai ser assinado

  //adicionando a assinatura no pdf (não adiciona a marcação, é apenas uma assinatura invisível, mas o adobe mostra na área de assinaturas)
  let pdfBufferRetorno = await pdflibAddPlaceholder({
    pdfBuffer,
    infoSignature,
    signatureLength: p12_certificado.length
  });

  const signedPdf = assinador.sign(pdfBufferRetorno, p12_certificado);

  const outputPath = 'D:/arquivo/pdf_assinado2.pdf';
  fs.writeFileSync(outputPath, signedPdf);

  return { resultado: 'Assinou o PDF com sucesso!' }

  /**
   * npm install --save easy-pdf-merge
   * BIBLIOTECA PRA JUNTAR VÁRIOS PDFS EM UM SÓ.
   *
    mergePDF(['P:/assinatura/assinar1.pdf', 'P:/assinatura/assinar2.pdf', 'P:/assinatura/assinar3.pdf'], 'P:/assinatura/COMPLETO.pdf', function(err){
      if(err) {
        return console.log(err)
      }
      console.log('Successfully merged!')
      });

      return { resultado: 'Os três PDFs viraram um PDF.' }
  */
})
