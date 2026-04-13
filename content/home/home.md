+++
title =  "Home"
type = "home"
draft = false
+++

{{< about-section
    title="About me"
    content="This content is using the <code>about-section</code> shortcode. <br/>You can write <code>HTML</code>, as long as you <em>wrap it</em> accordingly. "
    button_icon="icon-user"
    button_text="Check my skills"
    button_url="/skills"
    imgSrc="images/about/user-picture.png"
    imgScale="0.5"
    v_align="center"
    h_align="left"
 >}}

{{< platform-links >}}
    {{< link icon="linkedin" url="https://www.linkedin.com/in/adrianmoreno/" >}}
    {{< link icon="square-github" url="https://github.com/zetxek" >}}
{{< /platform-links >}}

{{< education-list
    title="Formal Education (education-list)" >}}

{{< experience-section
    title="My job experience (title)"
    intro_title="Intro (intro_title)"
    intro_description="Description (intro_description).<br>You can use HTML,with <strong>strong</strong> formatting, or lists <ul><li>one</li><li>two</li></ul>" 
    button1_url="https://example.com"
    button1_text="(1) Visit Example"
    button1_icon="icon-globe"
    button2_text="(2) Skills"
    button2_url="/skills"
    hideViewAll="false"
>}}

{{< experience-list
    title="Experience (as list)"
    padding="false" >}}

{{< client-and-work-section
    title="A selection of my work" >}} 

{{< testimonial-section
    title="What they say about me" >}}

{{< spacer size="large" >}}

## Extra home content

Additional content added after the `section` blocks, in the `home.md` file. 

Here you could freestyle, add other shortcodes, ...  Or just let the content empty, and rely on the shortcode sections alone.

{{< spacer size="small" >}}

{{< text-section
title="Extra (centered) content"
centered="true"
>}}

You can also use the `text-section` shortcode to add centered texts

{{< /text-section >}}
