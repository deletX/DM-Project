# Generated by Django 3.0.4 on 2020-03-30 19:57

import django.contrib.gis.db.models.fields
import django.contrib.gis.geos.point
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20200330_1503'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='notification',
            name='tette',
        ),
        migrations.AlterField(
            model_name='participant',
            name='starting_pos',
            field=django.contrib.gis.db.models.fields.PointField(default=django.contrib.gis.geos.point.Point(44.629418, 10.948245), srid=4326),
        ),
    ]
