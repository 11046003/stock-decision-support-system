# Generated by Django 5.0.1 on 2024-05-15 13:41

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0003_alter_accounting_available_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Account',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('balance', models.DecimalField(decimal_places=2, max_digits=10)),
                ('account_type', models.CharField(max_length=50)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='accounts', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'account',
            },
        ),
        migrations.CreateModel(
            name='APICredentials',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('api_key', models.CharField(max_length=255)),
                ('secret_key', models.CharField(max_length=255)),
                ('service_name', models.CharField(max_length=100)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='api_credentials', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'api_credentials',
            },
        ),
        migrations.CreateModel(
            name='InvestmentPortfolio',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField()),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='portfolios', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'investment_portfolio',
            },
        ),
        migrations.CreateModel(
            name='Investment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(max_length=50)),
                ('symbol', models.CharField(max_length=10)),
                ('shares', models.DecimalField(decimal_places=2, max_digits=10)),
                ('buy_price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('portfolio', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='investments', to='backend.investmentportfolio')),
            ],
            options={
                'db_table': 'investment',
            },
        ),
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('transaction_type', models.CharField(max_length=50)),
                ('account', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='transactions', to='backend.account')),
            ],
            options={
                'db_table': 'transaction',
            },
        ),
    ]
