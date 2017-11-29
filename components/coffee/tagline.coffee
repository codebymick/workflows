$ = require 'jquery'

do fill = (item = 'The most creative  in ART live here') ->
  $('.tagline').append "#{item}"
fill