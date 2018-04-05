// (function($, undefined) {
//
//   "use strict";
//
//   // When ready.
//   $(function() {
//
//     let $form = $( ".payment" );
//     let $input = $form.find( "input" );
//
//     $input.on( "keyup", function( event ) {
//       // When user select text in the document, also abort.
//       let selection = window.getSelection().toString();
//       if ( selection !== '' ) {
//         return;
//       }
//
//       // When the arrow keys are pressed, abort.
//       if ( $.inArray( event.keyCode, [38,40,37,39] ) !== -1 ) {
//         return;
//       }
//
//       let $this = $( this );
//
//       // Get the value.
//       let input = $this.val();
//       // debugger
//       let parsedInput = input.replace(/[\D\s\._\-]+/g, "");
//       parsedInput = parsedInput ? parseInt( parsedInput, 10 ) : 0;
//       $this.val( function() {
//         return ( parsedInput === 0 ) ? "" : input.toLocaleString( "en-US" );
//       } );
//     } );
//
//     /**
//     * ==================================
//     * When Form Submitted
//     * ==================================
//     */
//     // $form.on( "submit", function( event ) {
//     //   let $this = $( this );
//     //   let arr = $this.serializeArray();
//     //
//     //   for (let i = 0; i < arr.length; i++) {
//     //     arr[i].value = arr[i].value.replace(/[($)\s\._\-]+/g, ''); // Sanitize the values.
//     //   };
//     //
//     //   console.log( arr );
//     //
//     //   event.preventDefault();
//     // });
//
//   });
// })(jQuery);
let handler = StripeCheckout.configure({
  description: 'One-time donation',
  key: publishableKey,
  image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
  locale: 'auto',

  token: function(token) {
    $('input#stripeToken').val(token.id);
    $('form').submit();
  }
});

$('#donateButton').on('click', function(e) {
  e.preventDefault();

  $('#error_explanation').html('');

  var amount = $('input#amount').val();
  amount = amount.replace(/\$/g, '').replace(/\,/g, '')
  amount = parseFloat(amount);

  debugger
  if (amount < 5.00) {
    $('#error_explanation').html('<p>Donation amount must be at least $5.</p>');
  }
  else {
    amount = amount * 100; // Needs to be an integer!
    handler.open({
      amount: Math.round(amount)
    })
  }
});

$(window).on('popstate', function() {
  handler.close();
});
