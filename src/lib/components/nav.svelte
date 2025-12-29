<script>
    export let upDown = 'down'

    let csso = upDown.toLowerCase() == 'down' ? 'border-top: 2px solid;margin-top:1.25rem;padding-top:0.5rem;display:inline-block;' : 'border-bottom: 2px solid;margin-bottom:1.25rem;padding-bottom:0.5rem;display:inline-block;'
</script>

<div class='text-center'>
<div id='navblock' class='block' style={csso}>
    <ul id='navynav' class='space-x-6 flex justify-center text-l font-semibold'>
        <li class="mr-0">
            <a rel="me" href='https://joshnicholas.com/'>scribbles</a>
        </li >
        <li class="mr-0">
            <a href='/'>blog</a>
        </li >
        <!-- <li class="mr-0">
            <a href='/tinkering'>tinkering</a>
        </li > -->
        <li class="mr-0">
            <a rel="me" href='https://joshnicholas.com/about'>about</a>
        </li >
        <li class="mr-0">
            <a href='https://www.theguardian.com/profile/josh-nicholas' target='_blank' rel="me">guardian⤴</a>
        </li>
        <!-- <li class="mr-0">
            <a href='https://www.instagram.com/joshcnicholas' target='_blank' rel="me">insta⤴</a>
        </li> -->
    </ul>
</div>
</div>

<style>
    /* #navblock {
        border-top: 2px solid;
    } */

    a {
    color: black !important;}
</style>