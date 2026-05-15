
-----UserType Table
Create Table UserType (
TypeId int identity primary key,
TypeName varchar(20) unique not null
);

----UserDetails
Create Table Users(
	UserID int identity primary key,
    UserName varchar(20) unique not null,
	UserEmail varchar(50) unique not null,
    UserPassword varchar(20) not null,
	TypeId int references UserType(TypeId) on delete cascade not null
	)
------Category 
Create Table Category(
	categoryId int identity primary key,
	categoryName varchar(20) unique not null
	)


-------Brand
create table Brand(
	BrandId int identity primary key,
	BrandName varchar(20) unique not null
	)

--------Products
create table Product (ProdID int identity primary key,
	ProdName varchar(50) not null,
	ProdPrice int not null check(ProdPrice>0),
	Img varchar(200) not null,
	ProdDsc varchar(250) not null,
	Qty int not null check(Qty>0),
	categoryId int references Category(categoryId) on delete cascade not null,
	BrandId int references Brand(BrandId) on delete cascade not null
	 )

	----Drop Table Product

	--------Bill
	Create Table Bill(
	BillID int identity primary key,
	UserID int references Users(UserID) on delete cascade not null
	)

--------BillDetails
Create Table BillDetails(
BillDetailsID int identity primary key,
	BillID int references Bill(BillID) on delete cascade not null,
	ProdID int references Product(ProdID) on delete cascade not null,
	BillQty int not null check(BillQty>0),
	BillAmt int not null check(BillAmt>0)
	)

	-----Cart
Create Table Cart(
CartID int identity primary key,
	UserID int references Users(UserID) on delete cascade not null,
	ProdID int references Product(ProdID) on delete cascade not null,
	CartQty int not null check(CartQty>0),
	Price int not null check(Price>0)
	)
	
select * from cart
Select * from Users