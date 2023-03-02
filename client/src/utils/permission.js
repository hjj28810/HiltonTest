import router from './router'

router.beforeEach(async (to, from, next) => {

    // determine whether the user has logged in
    const hasToken = getToken()
    if (hasToken) {
        if (to.path === '/login') {
            // if is logged in, redirect to the home page
            next({ path: '/' })
        } else {
            try {
                next({ ...to, replace: true })
            }
            catch (error) {

            }
        }
    } else {
        console.log("token不存在");
        next(`/login?redirect=${to.path}`);
    }
})


router.afterEach(() => {

})