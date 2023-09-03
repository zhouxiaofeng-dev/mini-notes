# git

## 常用的linux命令

```
1.cd：改变目录
2.cd .. ：回退到上一级目录，直接cd进入默认目录
3.pwd：显示当前所在的目录路径
4.ls/ll：都是列出当前目录的所有文件，只不过ll列出的内容更为详细。
5.touch：新建一个文件，如touch index.js就会在当前目录下新建一个index.js文件。
6.rm：删除一个文件，rm index.js就会把index.js文件删除
7.mkdir：新建一个目录，就是新建一个文件夹
8.rm -r：删除一个文件夹，rm -r src 删除一个src目录             rm -rf / ：请勿尝试
9.mv移动文件，mv index.html src index.html是我们要移动的文件，src是目标文件夹，当然，这样写必须保证文件和目标文件夹在同一目录下。
10.reset重新初始化终端/清屏
11.clear：清屏
12.history：查看命令历史
13.help帮助
14.exit：退出
15.#表示注释
```

## git命令

```
git config -l：查看git的配置
git config --global user.name "..."   #名称
git config --global user-email 2331146197@qq.com  #邮箱

git init 在当前目录新建一个git代码库
git clone [url] 克隆一个项目和它的整个代码历史(版本信息)

```

## git的基本理论

```
git本地有三个工作区域，工作目录(Working Directory)、暂存区(Stage/Index)、资源库(Repository或Git Directory)。如果在加上远程的git仓库(Remote Directory)就可以分为四个工作区域。

Working Directory:工作区。就是你平时存放项目代码的地方
Index/Stage:暂存区，用于临时存放你的改动，事实上它只是一个文件，保存即将提交到文件列表信息
Repository:仓库区(本地仓库)，就是安全存放数据的位置，这里面有你提交到所有版本的数据，其中HEAD指向最新放入仓库的版本
Remote:远程仓库，托管代码的服务器，可以简单的认为是你项目组中的一台电脑用于远程数据交换。

git的工作流程
1.在工作目录中添加、修改文件
2.将需要进行版本管理的文件放入暂存区域 git add .
3.将暂存区域的文件提交到git仓库   git commit -m '.....'
因此，git管理的文件有三种状态:已修改(modified),已暂存(staged),已提交(committed)
```

## git文件操作

```
版本控制就是对文件的控制，要对文件进行修改、提交等操作，首先要知道文件当前在什么状态，不然可能会提交了现在还不想提交的文件，或者要提交的文件没提交上。
1.Untracked：未跟踪，此文件在文件夹中，但并没有加入到git库，不参与版本控制，通过git add状态变为Staged

2.Unmodify：文件已经入库，未修改，即版本库中的文件快照内容与文件夹中完全一致，这种类型的文件有两种去处，如果它被修改，而变为Modified。如果使用git rm移出版本库，则成为Untracked文件

3.Modified：文件已修改，仅仅只是修改，并没有进行其他的操作，这个文件也有两个去处，通过git add 可进入暂存区staged状态。使用git checkout 则丢弃修改过，返回到unmodify状态，这个git checkout则从库中取出文件，覆盖当前修改！

4.Staged：暂存状态，执行git commit则将修改同步到库中，这时库中的文件和本地文件又变为一致，文件为Unmodify状态。执行git reset HEAD filename取消暂存，文件状态为Modified


查看文件状态
#查看指定文件状态
git status [filename]
#查看所有文件状态
git status
```

![image-20230903223334960](C:\Users\86155\AppData\Roaming\Typora\typora-user-images\image-20230903223334960.png)

## git分支

```
# 列出所有分支
git branch
# 列出远程所有分支
git branch -r 
# 新建分支
git branch [分支名]
git checkout -b [分支名] 新建并切换

# 合并指定分支到当前分支
git merge [分支名]
# 删除分支
git branch -d [分支名]
# 删除远程分支
git push origin --delete [分支名]
git branch -dr [分支名]
```

