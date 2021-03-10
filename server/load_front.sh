rm -r ./app/AmuDames
cd ../AmuDames
ng build
cd ..
cp -r ./AmuDames/dist/AmuDames ./server/app/
