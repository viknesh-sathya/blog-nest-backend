# Ways of using clerk's auth:

    ## 1
        app.get("/auth-state", (req, res) => {
        const authState = getAuth(req);
        res.send(authState);
        });
    ## 2
        app.get("/protect", (req, res) => {
        const { userId } = getAuth(req);
        if (!userId)
        return res.status(401).json({
        error: "Forbidden",
        message: "You do not have permission to perform this action",
        });
        return res.status(200).json("Successfull ❤️");
        });
    ## 3
        app.get("/protect2", requireAuth(), (req, res) => {
        res.send("Hello world");
        });
