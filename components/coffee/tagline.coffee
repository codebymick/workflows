$ = require 'jquery'

do fill = (item = 'The   minds in ART live here') ->
  $('.tagline').append "#{item}" 
fill