<template>
    <footer id="footer" class="small-text">
        <li>
            <a href="https://github.com/WilliamConnatser/bitcoin-maximalism-v2" target="_blank" rel="noopener">
                <font-awesome-icon :icon="{ prefix: 'fab', iconName: 'github-square' }" class="extra-large-social-icons" />
            </a>
        </li>
        <li>
            <a href="https://twitter.com/BTCMaximalism21" target="_blank" rel="noopener">
                <font-awesome-icon :icon="{ prefix: 'fab', iconName: 'twitter-square' }" class="extra-large-social-icons" />
            </a>
        </li>
        <li>
            <a href="https://www.facebook.com/BitcoinMaximalism/" target="_blank" rel="noopener">
                <font-awesome-icon :icon="{ prefix: 'fab', iconName: 'facebook-square' }" class="extra-large-social-icons" />
            </a>
        </li>
        <br/>
        <li>&copy; YOLO International LLC 2019</li>
        </br>
        <li>
            <router-link to="/terms">Terms</router-link>
        </li>
        <li>
            <router-link to="/privacy">Privacy</router-link>
        </li>
    </footer>
</template>

<script>
    export default {
        name: "Footer"
    };
</script>