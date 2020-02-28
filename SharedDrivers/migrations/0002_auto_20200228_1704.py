# Generated by Django 3.0.3 on 2020-02-28 17:04

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('SharedDrivers', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='participant',
            name='car',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='SharedDrivers.Car'),
        ),
    ]
