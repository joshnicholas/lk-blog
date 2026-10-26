<script>
    export let upDown = 'down'

    let csso = upDown.toLowerCase() == 'down' ? 'border-top: 2px solid;margin-top:1.25rem;padding-top:0.5rem;' : 'border-bottom: 2px solid;margin-bottom:1.25rem;padding-bottom:0.5rem;'
</script>

<div class='nav-wrap'>
<div id='navblock' class='navblock' style={csso}>
    <ul id='navynav' class='navlinks'>
        <li>
            <a rel="me" href='https://joshnicholas.com/'>scribbles</a>
        </li >
        <li>
            <a href='https://links.joshnicholas.com/'>linklog</a>
        </li >
        <li>
            <a href='/'>blog</a>
        </li >
        <!-- <li>
            <a href='/tinkering'>tinkering</a>
        </li > -->
        <li>
            <a href='https://joshnicholas.com/journalism'>journalism</a>
        </li >
        <li>
            <a rel="me" href='https://joshnicholas.com/about'>about</a>
        </li >
        <li>
            <a href='https://links.joshnicholas.com/rss'>links rss</a>
        </li >
        <li>
            <a href='/feed'>blog rss</a>
        </li >
        <!-- <li>
            <a href='https://www.theguardian.com/profile/josh-nicholas' target='_blank' rel="me">guardian⤴</a>
        </li> -->
        <!-- <li>
            <a href='https://www.instagram.com/joshcnicholas' target='_blank' rel="me">insta⤴</a>
        </li> -->
    </ul>
</div>
</div>

<style>
    .nav-wrap {
        text-align: center;
    }

    .navblock {
        display: inline-block;
    }

    .navlinks {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 0.5rem 1.5rem;
        list-style: none;
        padding: 0;
        margin: 0;
        font-size: 1.125rem;
        font-weight: 600;
    }

    a {
        color: black !important;
        text-decoration: none !important;
    }

    @media (prefers-color-scheme: dark) {
        a {
            color: white !important;
        }
    }
</style>