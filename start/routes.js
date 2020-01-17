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

const HummusRecipe = use('hummus-recipe')

const SignPDF = use('node-signpdf')
const {plainAddPlaceholder} = use('node-signpdf/dist/helpers')

//import para a biblioteca de juntar pdfs em um só.
const mergePDF = use('easy-pdf-merge')

const assinador = new SignPDF.SignPdf();

Route.get('/', () => {

  const pdfDoc = new HummusRecipe('P:/assinatura/assinar.pdf', 'p:/assinatura/output.pdf');
  pdfDoc
      // edit 1st page
      .editPage(1)
      //.text('Pedro assinou essa porra!', 250, 700, {color: '#000000'})
      .image('P:/assinatura/assinatura.jpg', 200, 650, {width: 250, keepAspectRatio: true})
      .endPage()
      // end and save
      .endPDF();

      /**pdfDoc
        .structure('P:/assinatura/pdf-structure.txt')
        .endPDF(done);**/

  const p12_certificado = fs.readFileSync('P:/assinatura/certificate.p12'); //local do certificado p12
  let pdfBuffer = fs.readFileSync('p:/assinatura/output.pdf'); //local do pdf que vai ser assinado

  //adicionando a assinatura no pdf (não adiciona a marcação, é apenas uma assinatura invisível, mas o adobe mostra na área de assinaturas)
  pdfBuffer = plainAddPlaceholder({
    pdfBuffer,
    reason: 'Assinado por Pedro Azevedo.',
    local: 'IPREV MA',
    signatureLength: p12_certificado.length
  });

  console.log(SignPDF);
  const signedPdf = assinador.sign(pdfBuffer, p12_certificado);

  const outputPath = 'p:/assinatura/pdf_assinado2.pdf';
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
