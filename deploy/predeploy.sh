# we need to ensure our interpreter exists
if [[ `which expect` ]]; then
    echo 'expect already installed'
else
    echo 'installing expect'
    sudo apt-get install expect
fi