# project-LB

সফটওয়্যার ডেভেলপমেন্টের সবচেয়ে আলোচিত বিষয়গুলোর একটি হচ্ছে CI/CD পাইপলাইন। আজ আমরা দেখবো কীভাবে একটি Node.js অ্যাপ Dockerize করে সেটিকে GitHub Actions এর মাধ্যমে AWS EC2 তে auto Deploy করতে পারি । 

খুবই সিম্পল একটা nodejs অ্যাপ বানাই । 




server.js
এইখানে একটা GET রিকুয়েস্ট আছে যেইটা ব্রাউসার থেকে হিট করলে "Hello, World! This is a Dockerized app deployed via CI/CD pipeline.") এই ম্যাসেজ টা পাবো । যেহেতু আমাদের অ্যাপ্লিকেশন টা Dockerize করবো তাই একটা ডকার ফাইল এবং ডকার কম্পোস ফাইল বানবো । 




Dockerfile


ডকার ফাইলে আমরা মাল্টি স্টেজ ইউজ করেছি যেন শুধুমাত্র আমাদের প্রয়োজনীয় ফাইল নিয়ে প্রোডাকশন ইমেজ বানাতে পারি । মাল্টি স্টেজ নিয়ে একদিন বিস্তারিত লিখবো । 




docker-compose
ডকার কম্পোস ফাইলটা খুবই সিম্পল জাস্ট একটা সার্ভিস এইখানে থাকতেছে 





আমাদের লোকাল মেশিনে সব রেডি। চাইলে dokcer compose up দিয়ে এপ্লিকেশন টা টেস্ট করে দেখতে পারেন। এখন আমরা একটা গিটহাব একশন কনফিগার করবো যেন আমাদের পিসি / ল্যাপটপ থেকে কোড পুশ করলে আমাদের ডকার হাবে ইমেজ ক্রিয়েট হয় এবং aws ec2 instance সেই ইমজে পুল করে একটা কন্টেইনার রান করে এবং আমরা ec2 instance এর পাবলিক আইপি থেকে আমাদের অ্যাপ্লিকেশন টা রানিং দেখতে পারি। 

আমারদের কি কি লাগতেছে ? 

১। একটা ডকার হাব অ্যাকাউন্ট 

২। একটা aws ec2 instance 

 ec2 instance বানানো হয়ে গেলে সেইখানে ডকার ইন্সটল করে নিতে হবে। কিছু প্রয়োজনীয় কমান্ড আমি দিয়ে দিলাম 

sudo apt update
sudo apt install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER 
তাহলে আমাদের মোটামোটি সবকিছু রেডি এখন আমরা Github action workflow লিখবো । 

যেই রিপোজিটরি তে কোড পুশ করবো সেই রিপোজিটরিতে action => Choose a workflow => ডকার রিলেটেড একটা workflow নেই । 

আমার লেখা workflow এইখানে দিচ্ছি 




deploy.yml
এইখানে মেইনলি ৪টা স্টেপ কাজ করতেছে 

১। কোড চেকঅউট 

২। ডকার হাবে লগইন 

৩। ডকার ইমেজ বিল্ড এবং পুশ 

৪। ssh key ইউজ করে ec2 instance কে কানেক্ট করে ডকার হাব থেকে লেটেস্ট ইমেজ টা পুল নিয়ে একটা কন্টেইনার রান করতেছে 



এখন আমরা যদি আমাদের কোড পুশ করি তাহলে এইটা auto Deploy হবে। 

আমাদের ec2 instance এ গিয়ে আমরা চেক করে দেখতে পারি জিনিসটা 




chekcing from ec2
জিনসটা মজার না? ওহ আচ্ছা যদি কারো আমার করা কাজটার সম্পূর্ণ কোড দরকার হয় তাহলে জাস্ট এই রিপোজিটরিতে চেক দিলেই চলবে । 

https://github.com/Ruhulcse/docker-ci-cd

