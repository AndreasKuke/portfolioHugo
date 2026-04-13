+++
title =  "Inicio"
type = "home"
draft = false
+++

{{< about-section
    title="Sobre mí"
    content="Usando <code>sintaxis HTML</code>"
    about_button="Texto del botón"
    button_icon="info"
    button_text="Puedes editar esto"
    button_url="https://www.google.com"
    imgSrc="images/about/user-picture.png"
    imgScale="0.5"
    sectionId="sobre-mi"
 >}}

{{< platform-links sectionId="social" >}}
    {{< link icon="linkedin" url="https://www.linkedin.com/in/adrianmoreno/" >}}
    {{< link icon="square-github" url="https://github.com/zetxek" >}}
{{< /platform-links >}}

{{< education-list
    title="Formación académica"
    sectionId="formacion-academica" >}}

{{< experience-section
    title="Mi experiencia laboral (sección)"
    intro_title="Introducción"
    intro_description="Descripción.<br>Puedes usar HTML, con formato en <strong>negrita</strong>, o listas <ul><li>uno</li><li>dos</li></ul>" 
    button1_url="https://example.com"
    button1_text="Visitar Ejemplo"
    button1_icon="icon-globe"
    button2_text="Otro Botón (2)"
    button3_text="Ver todo"
    button3_url="/es/experience"
    sectionId="experiencia-laboral"
>}}


## Experiencia (lista)

Puedes ver una versión alternativa, usando `experience-list` en [/cv](/cv).
 

{{< client-and-work-section
    title="Una selección de mi trabajo"
    sectionId="trabajo" >}} 

{{< testimonial-section
    title="Lo que dicen de mí"
    sectionId="testimonios" >}}
