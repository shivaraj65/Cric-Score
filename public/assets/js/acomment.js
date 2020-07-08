$(".box .inputbox input").on("focus",function(){
                             $(this).addClass("focus");
                             });
$(".box .inputbox input").on("blur",function(){
  if($(this).val() == "")
                             $(this).removeClass("focus");
                             });

function validate(form)
{
  var input = document.forms.lform.email.value;
  
 alert("Your Email address is "+input);
  
return false;
}